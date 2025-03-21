import Card from "./components/card.ce.vue";
import { defineCustomElement } from "vue";

// 将 Vue 组件转为自定义元素类。
export const CardElement = defineCustomElement(Card);

// 记得在浏览器中注册元素类。
customElements.define("schema-card", CardElement);
