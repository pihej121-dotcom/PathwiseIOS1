import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface FileUploadExtractorProps {
  onTextExtracted: (text: string, fileName: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  autoExtractAndSave?: boolean;
  resetKey?: number;
}

export function FileUploadExtractor({ onTextExtracted, onClear, disabled, autoExtractAndSave = false, resetKey }: FileUploadExtractorProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset component when resetKey changes
  useEffect(() => {
    if (resetKey !== undefined) {
      setSelectedFile(null);
      setExtractionComplete(false);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [resetKey]);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|doc)$/i)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    // Clear parent state immediately when new file is selected
    if (autoExtractAndSave && onClear) {
      onClear();
    }

    setSelectedFile(file);
    setError(null);
    setExtractionComplete(false);

    if (autoExtractAndSave) {
      await extractText(file);
    }
  };

  const extractText = async (file: File) => {
    setIsExtracting(true);
    setError(null);

    try {
      let extractedText = '';

      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(file);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword' ||
        file.name.toLowerCase().match(/\.(docx|doc)$/)
      ) {
        extractedText = await extractTextFromDOCX(file);
      }

      if (!extractedText.trim()) {
        throw new Error('No text could be extracted from the file');
      }

      onTextExtracted(extractedText, file.name);
      setExtractionComplete(true);
      
      if (!autoExtractAndSave) {
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err: any) {
      console.error('Text extraction error:', err);
      setError(err.message || 'Failed to extract text from file');
      setExtractionComplete(false);
      // Clear parent state on extraction failure to prevent saving stale data
      if (autoExtractAndSave && onClear) {
        onClear();
      }
    } finally {
      setIsExtracting(false);
    }
  };

  const handleExtract = async () => {
    if (!selectedFile) return;
    await extractText(selectedFile);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    setExtractionComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Notify parent to clear its state
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isExtracting}
          data-testid="input-file-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isExtracting}
          data-testid="button-select-file"
          className="w-full sm:w-auto"
        >
          <Upload className="w-4 h-4 mr-2" />
          {autoExtractAndSave ? 'Upload Resume' : 'Select File'}
        </Button>
        {selectedFile && autoExtractAndSave && (
          <Card className="flex-1 w-full">
            <div className="flex items-center gap-3 p-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {isExtracting ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
                ) : extractionComplete ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                )}
                <span className="text-sm font-medium truncate" data-testid="text-selected-file">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {isExtracting ? 'Processing...' : extractionComplete ? 'Ready to save' : 'Selected'}
                </div>
                {extractionComplete && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={isExtracting}
                    data-testid="button-change-file"
                  >
                    Change
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}
        {selectedFile && !autoExtractAndSave && (
          <Card className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium truncate" data-testid="text-selected-file">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleExtract}
                  disabled={isExtracting}
                  data-testid="button-extract-text"
                  className="flex-1 sm:flex-none"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    'Extract Text'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive" data-testid="text-error">
          {error}
        </p>
      )}
    </div>
  );
}
