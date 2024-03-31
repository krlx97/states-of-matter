<script lang="ts">
  import {ModalComponent/*, SelectComponent*/} from "ui";
  // let selected: "Mobile" | "1366x768" | "1920x1080" | "2560x1440" | "3840x2160";

  // let onResolutionChange = (): void => {
  //   const app = document.getElementById("app");

  //   if (!app) { return; }

  //   if (selected === "Mobile") {
  //     app.style.transform = "scale(0.3333)";
  //   } else if (selected === "1366x768") {
  //     app.style.transform = "scale(0.6666)";
  //   } else if (selected === "1920x1080") {
  //     app.style.transform = "scale(1)";
  //   } else if (selected === "2560x1440") {
  //     app.style.transform = "scale(1.3333)";
  //   } else if (selected === "3840x2160") {
  //     app.style.transform = "scale(2)";
  //   }
  // };
</script>

<ModalComponent>
  <div class="modal__info">Coming soon...</div>
  <!-- <SelectComponent
    label="Resolution"
    values="{["Mobile", "1366x768", "1920x1080", "2560x1440", "3840x2160"]}"
    bind:selected
    on:change="{onResolutionChange}"/>
  <br/>
  <div class="slidecontainer">
    <label>Volume</label>
    <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
  </div> -->
</ModalComponent>
