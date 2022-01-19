declare module '*.scss' {
  const styles: { readonly [key: string]: string };
  export default styles;
}

declare module '*.css' {
  const styles: { readonly [key: string]: string };
  export default styles;
}

declare module '*.png' {
  const url: string;
  export default url;
}

declare module '*.mov' {
  const url: string;
  export default url;
}
