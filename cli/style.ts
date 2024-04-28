/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/named-color}
 */
export function color(msg: string, color: string): [string, string] {
  return [`%c${msg}`, `color: ${color}`];
}

interface StyleProps {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
}

export function style(msg: string, props: StyleProps): [string, string] {
  const styles = [];
  if (props.bold) {
    styles.push("font-weight: bold;");
  }
  if (props.italic) {
    styles.push("font-style: italic;");
  }
  if (props.underline) {
    styles.push("text-decoration: underline;");
  }
  if (props.color) {
    styles.push(`color: ${props.color};`);
  }
  return [`%c${msg}`, styles.join(" ")];
}
