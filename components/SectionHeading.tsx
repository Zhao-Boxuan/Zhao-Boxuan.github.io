import { TextType } from './TextType';

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
}

export function SectionHeading({ index, eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="section-heading" data-motion="reveal">
      <span className="section-heading-guide" aria-hidden="true" />
      <div className="section-index"><span>+</span> ({index})</div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <TextType
          as="h2"
          cursorCharacter="|"
          startOnVisible
          text={title}
          typingSpeed={65}
          visibleOffset={20}
        />
      </div>
    </div>
  );
}
