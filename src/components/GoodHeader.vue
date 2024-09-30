<template>
  <div class="header">
    <div class="organization">
      <div class="logo" @click="handleMenuClick(MenuList.ACCUEIL)">
        <img src="@/assets/dice.svg" alt="" />
      </div>
      <div class="">
        <span class="name goodloka" @click="handleMenuClick(MenuList.ACCUEIL)">GoodLoka</span>/
        <span class="name game_name">{{ appStore.breadCrumbName }}</span>
      </div>
    </div>
    <div class="right">
      <button class="btn_primary outline wallet" @click="handleMenuClick(MenuList.HISTORY)">
        💰{{ userStore.user.wallet?.balance?.toLocaleString('fr-FR', { style: 'currency', currency: 'MGA' }) }}
      </button>

      <div class="menu_container" v-click-outside="closeMenu">
        <button class="menu_btn" @click="toggleMenu">☰</button>
        <div v-if="isMenuOpen" class="dropdown_menu">
          <button class="menu_item avatar_container">
            <div class="avatar">
              <img
                :src="'https://ui-avatars.com/api/?background=random&name=' + userStore.user.pseudo?.replace(' ', '+')"
                alt=""
                srcset=""
              />
            </div>
            <div class="bold">{{ userStore.user.pseudo }}</div>
            <div class="phone">{{ userStore.user.phone }}</div>
          </button>
          <button class="menu_item" @click="handleMenuClick(MenuList.ACCUEIL)">
            <div>🏠 Accueil</div>
          </button>
          <button class="menu_item" @click="handleMenuClick(MenuList.DEPOSIT)">
            <div>💶 Dépôt</div>
          </button>
          <button class="menu_item" @click="handleMenuClick(MenuList.WITHDRAWAL)">
            <div>💸 Retrait</div>
          </button>
          <button class="menu_item" @click="handleMenuClick(MenuList.HISTORY)">
            <div>📆 Historique</div>
          </button>
          <button class="menu_item" @click="handleMenuClick(MenuList.NOTIFICATION)">
            <div>
              🔔 Notifications
              <div class="notification_indicator"></div>
            </div>
          </button>
          <button class="menu_item" @click="handleMenuClick(MenuList.MON_COMPTE)">
            <div>🔑 Mon compte</div>
          </button>
          <button class="menu_item text_danger" @click="handleMenuClick(MenuList.DECONNECTER)">
            <div>⤎ Déconnecter</div>
          </button>
        </div>
      </div>
    </div>
    <div class="user_connected">
      <div class="count">44</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { useUserStore } from '@/stores/user.store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const appStore = useAppStore();
const authStore = useAuthStore();
const toastStore = useToastStore();

const router = useRouter();
const isMenuOpen = ref(false);
enum MenuList {
  ACCUEIL = 'ACCUEIL',
  DEPOSIT = ' DEPOSIT',
  WITHDRAWAL = ' WITHDRAWAL',
  NOTIFICATION = 'NOTIFICATION',
  MON_COMPTE = 'MON_COMPTE',
  DECONNECTER = 'DECONNECTER',
  HISTORY = 'HISTORY'
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

function handleMenuClick(menuName: MenuList) {
  closeMenu();
  switch (menuName) {
    case MenuList.ACCUEIL:
      router.replace({ name: 'home' });
      break;
    case MenuList.DEPOSIT:
      router.push({ name: 'deposit' });
      break;
    case MenuList.WITHDRAWAL:
      router.push({ name: 'withdrawal' });
      break;
    case MenuList.HISTORY:
      router.push({ name: 'history' });
      break;
    case MenuList.NOTIFICATION:
      router.push({ name: 'notifications' });
      break;
    case MenuList.MON_COMPTE:
      router.push({ name: 'account' });
      break;
    case MenuList.DECONNECTER:
      logout();
      break;

    default:
      break;
  }
}

function logout() {
  appStore.appIsLoading = true;
  authStore
    .logout()
    .then(() => {
      toastStore.createToast('Déconnecté');
      router.replace({ name: 'login' });
    })
    .catch((err) => {
      console.log(err.response);
    })
    .finally(() => {
      appStore.appIsLoading = false;
    });
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 50%;
  width: 100%;
  max-width: 800px;
  height: 56px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-light);
  padding: 0 8px;
  background: #fff;
  transform: translate(-50%);
}

.organization {
  flex: 1;
  display: flex;
  align-items: center;
}

.right {
  margin-left: auto;
  padding: 0 8px;
  display: flex;
  align-items: center;
}

.user_connected {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 12px;
  line-height: 12px;
  color: var(--color-success);
  border-radius: 5px;
  z-index: 1;
  background: #fff;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
}
.logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  img {
    width: 32px;
    height: 32px;
  }
}
.name {
  padding: 0 8px;
  font-size: 16px;
  font-family: var(--font-family);
  font-weight: 700;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: 768px) {
  .name {
    &.goodloka {
      line-height: 16px;
      font-size: 12px;
    }
    &.game_name {
      line-height: 20px;
      display: block;
    }
  }
}

/* styles menu */

.menu_container {
  position: relative;
  display: inline-block;
}

.menu_btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.dropdown_menu {
  position: absolute;
  min-width: 200px;
  background-color: #fff;
  border-radius: 6px;
  z-index: 2;
  right: 0;
  box-shadow:
    0 5px 5px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0 8px 10px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0 3px 14px 2px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12));
}

.menu_item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-top: 1px solid #d3d3d36b;
}

.menu_item:hover {
  background-color: #f0f0f0;
}

.wallet {
  padding: 0px 4px;
}

@media (min-width: 768px) {
  .wallet {
    padding: 4px 8px;
  }
}

.avatar_container {
  text-align: center;
  border: none;
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    margin: auto;
    img {
      width: 32px;
      height: 32px;
    }
  }
  .phone {
    font-size: 10px;
  }
}

.badge_danger {
  display: inline-block;
  background: var(--color-danger);
  color: white;
  padding: 2px 6px;
  border-radius: 50%;
  font-size: 12px;
}

.notification_indicator {
  display: inline-block;
  background: var(--color-danger);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  margin: 0 4px;
}
</style>
