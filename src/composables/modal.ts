import { readonly, ref } from 'vue';

export interface IModal {
  name: string;
  visible: boolean;
}

export default function useModal() {
  const modals = ref<IModal[]>([]);

  const registerModal = (name: string) => {
    modals.value.push({
      name,
      visible: false,
    } as IModal);
  };

  const findModal = (name: string): IModal | undefined => modals.value.find((m) => m.name === name);

  const isModalVisible = (name: string) => {
    const m = findModal(name);
    return m ? m.visible : undefined;
  };

  const showModal = (name: string) => {
    const m = findModal(name);
    if (m) m.visible = true;
  };

  const hideModal = (name: string) => {
    const m = findModal(name);
    if (m) m.visible = false;
  };

  const toggleModal = (name: string) => {
    const m = findModal(name);
    if (m) m.visible = !m.visible;
  };

  return {
    modals: readonly(modals),
    registerModal,
    isModalVisible,
    showModal,
    hideModal,
    toggleModal,
  };
}
