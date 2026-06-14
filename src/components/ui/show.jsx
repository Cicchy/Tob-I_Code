"use client";;
export const Show = (props) => {
  const { when, fallback, children } = props;

  if (when) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
