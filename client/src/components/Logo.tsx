import logoImageLight from "@assets/Pathwise_Logo_BlackP_1761100602134.png";
import logoImageDark from "@assets/Pathwise_Logo_WhiteP_1761100602133.png";
import { useTheme } from "@/contexts/ThemeContext";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16", 
    lg: "h-24 w-24"
  };

  const logoImage = theme === "dark" ? logoImageDark : logoImageLight;

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