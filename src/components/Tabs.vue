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
        return ["start", "end", "center"].includes(value);
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
    const _tabItems = ref([]);

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
      document.addEventListener("keydown", onTabKeyDown);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("keydown", onTabKeyDown);
    });

    watch(defaultIndex, (newValue, oldValue) => {
      if (newValue !== selectedIndex.value) {
        selectedIndex.value = newValue;
      }
    });

    watch(resetTabs, (newValue, oldValue) => {
      if (newValue === true) reset();
    });

    return () => {
      _tabItems.value = (slots as any)
        .default()
        .filter((component: any) => component.type.name === "Tab");

      const tabList: Array<VNode> = [];
      _tabItems.value.forEach((tab: VNode, index: number) => {
        const _tabProps = tab.props as {
          title?: string;
          "title-slot"?: string;
          disabled?: boolean | string;
        };

        const content = _tabProps["title-slot"]
          ? (slots as any)
              .default()
              .filter(
                (item: any) =>
                  item.type === "template" &&
                  item.props.name === _tabProps["title-slot"]
              )[0].children
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
            content
          )
        );
      });

      const _tabsList = h(
        "ul",
        { class: `nav nav-tabs tab-list ${position.value}`, role: "tabList" },
        tabList
      );

      return h(
        "div",
        {
          class: `tabs ${direction.value} ${reverse.value ? "reverse" : ""}`,
          role: "tabs",
        },
        [
          _tabsList,
          h("div", { class: "tab" }, _tabItems.value[selectedIndex.value]),
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
      padding: 8px 0px;
      cursor: pointer;
      user-select: none;
      transition: border 0.3s ease-in-out;
      position: relative;
      bottom: -1px;
      text-transform: uppercase;
      letter-spacing: 0.05rem;

      &:not(:first-child) {
        margin-left: 10px;
      }

      &[aria-selected="true"] {
        border-bottom: 2px solid var(--primary-color);
        font-weight: 700;
        color: var(--primary-color);
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
    .tab-list {
      flex-direction: column;
      border-bottom: none;
      border-right: 1px solid var(--border-color);

      &__item {
        margin-left: 0;
        border-radius: 0;

        &[aria-selected="true"] {
          border: none;
          border-left: 2px solid var(--primary-color);
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