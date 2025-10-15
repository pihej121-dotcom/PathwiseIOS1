import logoImage from "@assets/pathwise-logo-new.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoImage}
        alt="Pathwise Logo"
        className={`${sizeClasses[size]} object-contain`}
        data-testid="pathwise-logo"
      />
    </div>
  );
}