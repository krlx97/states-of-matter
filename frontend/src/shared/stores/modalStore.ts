import type { SvelteComponent } from "svelte";
import {writable} from "svelte/store";

const modalStore = writable<{component: any, data: any | undefined, isVisible: boolean}>({
  component: undefined,
  data: undefined,
  isVisible: false
});

export {modalStore};

// import {dialogData} from "../../stores/dialogDataStore";

// import CreateEditHeaderMeal from "./DietDialogs/CreateEditHeaderMeal.svelte";
// import CreateEditPDFMeal from "./DietDialogs/CreateEditPDFMeal.svelte";
// import CreateEditRecipeMeal from "./DietDialogs/CreateEditRecipeMeal.svelte";
// import CreateEditTextMeal from "./DietDialogs/CreateEditTextMeal.svelte";

// // execute fn je nepotreban jer u dialog stoji onSubmit i apdejtuje storove,
// // oni automatski apdejtuju ui
// interface CreateEditHeaderMealData {
//   executeFunction?: () => void;
// }

// interface CreateEditPDFMealData {
//   executeFunction?: () => void;
// }

// interface CreateEditRecipeMealData {
//   executeFunction?: () => void;
// }

// interface CreateEditTextMealData {
//   title: string;
//   executeFunction?: () => void;
// }

// interface DialogData {
//   CreateEditHeaderMeal: CreateEditHeaderMealData;
//   CreateEditPDFMeal: CreateEditPDFMealData;
//   CreateEditRecipeMeal: CreateEditRecipeMealData;
//   CreateEditTextMeal: CreateEditTextMealData;
// }

// const dialogs = {
//   CreateEditHeaderMeal,
//   CreateEditPDFMeal,
//   CreateEditRecipeMeal,
//   CreateEditTextMeal,
// };

// const openDialog = <Key extends keyof DialogData>(
//   dialog: Key,
//   data: DialogData[Key]
// ): void => {
//   dialogData.update((store) => {
//     store.component = dialogs[dialog];
//     store.data = data;
//     return store;
//   });
// };

// ***Intellisense works!
// openDialog("CreateEditTextMeal", {title: "some title"});

// export {openDialog};