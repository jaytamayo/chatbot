import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CopyToClipboard as Clipboard, Props } from "react-copy-to-clipboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Check, Files } from "lucide-react";

const CopyToClipboard = ({ text }: Props) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation("common");

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Clipboard text={text} onCopy={handleCopy}>
            {copied ? (
              <Check className="size-5" />
            ) : (
              <Files className="size-5" />
            )}
          </Clipboard>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? t("copied") : t("copy")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyToClipboard;
