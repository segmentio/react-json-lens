declare module 'shader' {
  /**
   * Creates darker or lighter shades of a hex color
   *
   * @param hexColor the hex code for the color
   * @param lightness a range from -1.0 (darkest) to 1.0 (lightest)
   */
  export default function shader(hexColor: string, lightness: number): string
}
