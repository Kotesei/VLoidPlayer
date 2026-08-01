import Lottie from "lottie-web";

export function animate(container: Element, path: string) {
  const animation = Lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path,
  });
  return animation;
}
