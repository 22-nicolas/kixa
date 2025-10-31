import { initChecks } from "../features/search.js";
import { createItems } from "../features/search.js";
import { initPriceSlider } from "../features/price-slider.js";
import { initSort } from "../features/search.js";

initPriceSlider();
initChecks();
initSort();
createItems();