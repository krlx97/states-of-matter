import {create_animation} from "svelte/internal";

// const animation = create_animation();

const moveToGraveyard = (node) => {
  node.style.transformOrigin = "bottom right";
  return {
    duration: 500,
    css(t, u) {
      console.log(t,u);
      return `transform: translateX(${u * -0.27}turn); opacity: ${t};`;
    }
  };
};

export {moveToGraveyard};
