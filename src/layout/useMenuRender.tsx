import { useRoute, useRouter } from 'vue-router';
import indexScss from './index.module.scss';
import appList from '@/router/app-list';
import { computed } from 'vue';

/**
 * 菜单渲染
 */
export function useMenuRender() {
  const route = useRoute();
  const router = useRouter();
  const curRoutePath = computed(() => route.path);

  function render() {
    return (
      <div class={indexScss.menu}>
        {appList.map((it) => {
          return it.children ? (
            <>
              <div class={indexScss['menu-item-label']}>{it.name}</div>
              <div class={indexScss['menu-item-children']}>
                {it.children.map((ele) => (
                  <div
                    class={[
                      indexScss['menu-item-link'],
                      curRoutePath.value.includes(ele.path) && indexScss['menu-item-link-active'],
                    ]}
                    onClick={() => router.push({ name: ele.name })}
                  >
                    <div class={indexScss['menu-item-link-name']}>{ele.name}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div
              class={[
                indexScss['menu-item-link'],
                curRoutePath.value.includes(it.path) && indexScss['menu-item-link-active'],
              ]}
              onClick={() => router.push({ name: it.name })}
            >
              <div class={indexScss['menu-item-link-name']}>{it.name}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return {
    renderMenu: render,
  };
}
