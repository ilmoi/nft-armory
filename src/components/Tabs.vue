<script lang="ts">
import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
  toRefs,
  h,
  VNode,
  computed,
  onBeforeUpdate,
} from "vue";

interface IProps {
  defaultIndex: number;
  resetTabs: boolean;
  position: string;
  direction: string;
  reverse: boolean;
}

export default defineComponent({
  name: "Tabs",
  props: {
    defaultIndex: {
      default: 0,
      type: Number,
    },
    resetTabs: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: "horizontal",
      validator(value: string) {
        return ["horizontal", "vertical"].includes(value);
      },
    },
    position: {
      type: String,
      default: "left",
      validator(value: string) {
        return ["left", "start", "end", "center"].includes(value);
      },
    },
    reverse: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: {
    tabChanged(index: number) {
      return index !== undefined || index !== null;
    },
  },
  setup(props: IProps, { emit, slots, attrs }) {
    const { defaultIndex, resetTabs, position, direction, reverse } =
      toRefs(props);

    const selectedIndex = ref(0);
    const tabs = ref<Array<any>>([]);
    const _tabItems = ref<any[]>([]);    

    const onTabKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (parseInt(e.key) - 1 in tabs.value) {
          e.preventDefault();
          switchTab(e, parseInt(e.key) - 1, tabs.value[parseInt(e.key) - 1]);
        }
      }
    };

    const reset = () => {
      selectedIndex.value = 0;
    };

    const switchTab = (_: any, index: number, isDisabled: boolean) => {
      if (!isDisabled) {
        selectedIndex.value = index;
        emit("tabChanged", index);
      }
    };

    onMounted(() => {
      getTabItems();
      document.addEventListener("keydown", onTabKeyDown);
    });

    onBeforeUpdate(() => {
      getTabItems();
    })

    onBeforeUnmount(() => {
      document.removeEventListener("keydown", onTabKeyDown);
    });

    const getTabItems = () => {
      _tabItems.value.splice(0, _tabItems.value.length);
      (slots as any).default().forEach((component: any) => {
        if (component.type.name && component.type.name === "Tab") {
          _tabItems.value.push(component);
        } else {
          component.children.forEach((cComp: any) => {
            if (cComp.type.name && cComp.type.name === "Tab") {
              _tabItems.value.push(cComp);
            }
          });
        }
      });
    };

    const getTitleSlotContent = (titleSlot: string): any => {
      let slotContent: any = null;
      let shouldSkip = false;
      (slots as any).default().forEach((item: any) => {
        if (shouldSkip) {
          return;
        }
        if (item.type === "template" && item.props.name === titleSlot) {
          slotContent = item.children;
          shouldSkip = true;
        } else {
          if (item.children.length) {
            item.children.forEach((cItem: any) => {
              if (shouldSkip) {
                return;
              }
              if (cItem.props.name === titleSlot) {
                slotContent = cItem.children;
                shouldSkip = true;
              }
            });
          }
        }
      });
      return slotContent === null ? [] : slotContent;
    };

    watch(defaultIndex, (newValue, oldValue) => {
      if (newValue !== selectedIndex.value) {
        selectedIndex.value = newValue;
      }
    });

    watch(resetTabs, (newValue, oldValue) => {
      if (newValue === true) reset();
    });

    const tabToDisplay = computed(() => {
      return _tabItems.value.map((item, idx) => {
        return h(
          "div",
          {
            class: "tab",
            style: `display: ${selectedIndex.value == idx ? "block" : "none"}`,
          },
          item
        );
      });
      // return h("div", { class: "tab" }, _tabItems.value[selectedIndex.value]);
    });

    return () => {
      const tabList: Array<VNode> = [];
      _tabItems.value.forEach((tab: VNode, index: number) => {
        const _tabProps = tab.props as {
          title?: string;
          "title-slot"?: string;
          disabled?: boolean | string;
        };

        const titleContent = _tabProps["title-slot"]
          ? getTitleSlotContent(_tabProps["title-slot"])
          : _tabProps.title;
        const isDisabled =
          _tabProps.disabled === true || _tabProps.disabled === "";
        tabs.value[index] = isDisabled;

        tabList.push(
          h(
            "li",
            {
              class: selectedIndex.value === index ? "tab-list__item navlink active": "tab-list__item navlink",
              tabIndex: "0",
              role: "tabItem",
              "aria-selected": selectedIndex.value === index ? "true" : "false",
              "aria-disabled": isDisabled ? "true" : "false",
              onClick: (e: MouseEvent) => {
                switchTab(e, index, isDisabled);
              },
            },
            titleContent
          )
        );
      });

      return h(
        "div",
        {
          class: `tabs ${direction.value} ${reverse.value ? "reverse" : ""}`,
          role: "tabs",
        },
        [
          h(
            "ul",
            { class: `tab-list ${position.value}`, role: "tabList" },
            tabList
          ),
          ...tabToDisplay.value,
        ]
      );
    };
  },
});
</script>

<style lang="scss"> 
:root {
  --primary-color: #f2f4f8;
  --border-color: #e2e2e2;
  --disabled-text-color: #878d96;
}
.tabs {
  display: grid;
  grid-template-columns: 1fr;
  .tab-list {
    list-style: none;
    display: flex;
    padding-left: 0;
    border-bottom: 1px solid #697077;
    &.center {
      justify-content: center;
    }
    &.end {
      justify-content: flex-end;
    }
    &__item {
      padding: 8px 8px;
      cursor: pointer;
      user-select: none;
      //transition: border 0.3s ease-in-out;
      position: relative;
      bottom: -1px;
      text-transform: uppercase;
      letter-spacing: 0.05rem;

      &:not(:first-child) {
        margin-left: 10px;
      }

      &[aria-selected="true"] {
        border-bottom: 1px solid var(--primary-color);
        font-weight: 700;
        color: var(--primary-color);
      }
      &[aria-selected="false"] {
        font-weight: 700;
        color: var(--disabled-text-color);
      }
      &[aria-disabled="true"] {
        cursor: not-allowed;
        color: #878d96;
      }
    }
  }
  &.horizontal {
    &.reverse {
      .tab-list {
        grid-row: 2;
        border: none;
        border-top: 1px solid var(--border-color);
      }
    }
  }

  &.vertical {
    grid-template-columns: auto 1fr;
    gap: 1rem;

    .tab {
        background: #343A3F;
        margin: 8px 0px;
    }

    .tab-list {
      flex-direction: column;
      border-bottom: none;
      width: 416px;
      height: 94px;
      
     // border-right: 1px solid var(--border-color);

      &__item {
        margin-left: 0;
        border-radius: 0;
        background: #343A3F;
        box-sizing: border-box;
        align-self: stretch;
        margin: 8px 0px;

        &[aria-selected="true"] {
          border: none;
          border: 2px solid var(--primary-color);
          border-radius: 4px;
    
        }
      }
    }

    &.reverse {
      grid-template-columns: 1fr auto;
      .tab-list {
        grid-column: 2;
        border: none;
        border-left: 1px solid var(--border-color);
      }

      .tab {
        grid-row: 1;
        grid-column: 1;
      }
    }
  }
}
</style>