import { animate, animation, state, style, transition, trigger, useAnimation } from "@angular/animations";

const slightFadeInAnimation = animation([
  style({
    opacity: 0,
    transform: "translateY(5%)"
  }),
  animate("500ms ease-out", style({
    opacity: 1,
    transform: "translateY(0)"
  }))
]);

const fadeInAnimation = animation([
  style({
    opacity: 0,
    transform: "translateY(10%)"
  }),
  animate("500ms ease-out", style({
    opacity: 1,
    transform: "translateY(0)"
  }))
]);

export const fadeIn = trigger("fadeIn", [
  transition(":enter", [
    useAnimation(fadeInAnimation)
  ])
]);

export const slightFadeIn = trigger("slightFadeIn", [
  transition(":enter", [
    useAnimation(slightFadeInAnimation)
  ])
]);

const fadeInMenuAnimation = animation([
  animate("200ms ease-out")
]);

export const fadeInMenu = trigger("fadeInMenu", [
  state("open", style({
    opacity: 1,
    transform: "translateY(0)"
  })),
  state("close", style({
    opacity: 0,
    transform: "translateY(-5%)"
  })),
  transition("open <=> close", [
    useAnimation(fadeInMenuAnimation)
  ])
]);
