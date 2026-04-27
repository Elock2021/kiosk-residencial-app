import { FiArrowRight } from "react-icons/fi";

interface HomeActionButtonProps {
  Image: any;
  title: string;
  description?: string;
  onClick?: () => void;
  featured?: boolean;
  variant?: "primary" | "secondary";
  eyebrow?: string;
  size?: "lg" | "md" | "sm";
}

const HomeActionButton = ({
  Image,
  title,
  description,
  onClick,
  featured = false,
  variant = "secondary",
  eyebrow,
  size = "md",
}: HomeActionButtonProps) => {
  return (
    <button
      type="button"
      className={`res-home-action res-home-action--${variant} res-home-action--size-${size} ${featured ? "res-home-action--featured" : ""}`}
      onClick={onClick}
    >
      <div className="res-home-action__top">
        <div className="res-home-action__icon">
          <Image />
        </div>
        <div className="res-home-action__arrow">
          <FiArrowRight />
        </div>
      </div>
      <div className="res-home-action__body">
        {eyebrow ? <div className="res-home-action__eyebrow">{eyebrow}</div> : null}
        <div className="res-home-action__title">{title}</div>
        {description ? (
          <div className="res-home-action__description">{description}</div>
        ) : null}
      </div>
    </button>
  );
};

export default HomeActionButton;
