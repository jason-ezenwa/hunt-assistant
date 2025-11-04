import { Mail } from "lucide-react";

const TwitterIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor">
      <title>X</title>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
};

const Footer = () => {
  return (
    <footer className="relative z-10 py-8 border-t">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/chukwuemelie-obumse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-medium hover:text-primary transition-colors">
              Chukwuemelie Obumse
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com/turntupjasonn"
              className="text-muted-foreground hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer">
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a
              href="mailto:emelieobumse100@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
              target="_blank">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
