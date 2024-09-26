<template>
    <div>
       <RouterView>
        <template #default="{ Component, route }">
          <transition name="fade" mode="slide-right">
            <component :is="Component" :key="route.path" />
          </transition>
        </template>
       </RouterView>
    </div>
</template>

