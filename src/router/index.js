import { createRouter, createWebHistory } from 'vue-router'
export const routes = [
    {
        name: '文件管理',
        path: '/fileManagement',
        children: [
            {
                name: '文件管理',
                path: '/files',
                component: () => import('@/pages/fileManagement/files.vue'),
                meta: {
                    icon: 'Document'
                }
            },
            {
                name: '文件审核',
                path: '/filesAudit',
                component: () => import('@/pages/fileManagement/filesAudit.vue'),
                meta: {
                    icon: 'Document'
                }
            }
        ],
        meta: {
          icon: 'Document'
        }
    },
    {
        name: '用户管理',
        path: '/userManagement',
        children: [
            {
                name: '用户管理',
                path: '/user',
                component: () => import('@/pages/userManagement/user.vue'),
                meta: {
                    icon: 'User'
                }
            }
        ],
        meta: {
            icon: 'User'
        }
    },
    {
        name: '部门管理',
        path: '/departmentManagement',
        children: [
            {
                name: '部门管理',
                path: '/department',
                component: () => import('@/pages/departmentManagement/department.vue'),
                meta: {
                    icon: 'Folder'
                }
            }
        ],
        meta: {
            icon: 'Folder'
        }
    },
    {
        name: '系统配置',
        path: '/sysConfig',
        children: [
            {
                name: '系统配置',
                path: '/sys',
                component: () => import('@/pages/sysConfig/sys.vue'),
                meta: {
                    icon: 'Setting'
                }
            }
        ],
        meta: {
            icon: 'Setting'
        }
    }
]
const router = createRouter({
    history: createWebHistory(),//工作模式 ，还有一种是hash
    routes: [{
        path: '/',
        redirect: '/files',
    }, {
        name: 'notFound',
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/NotFound.vue')
    }, {
        name: 'login',
        path: '/login',
        component: () => import('@/pages/login/index.vue')
    },
    {
        name: 'home',
        path: '/home', //pages下的vue文件的路径
        component: () => import('@/pages/home/index.vue'), //pages下的vue文件
        children: routes
    }],
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token') // 假设使用 localStorage 存储 token

    if (to.name !== 'login' && !isAuthenticated) {
        // 如果用户未登录且访问的不是登录页，则重定向到登录页
        next({ name: 'login' })
    } else {
        // 否则继续正常导航
        next()
    }
})

export default router //向外抛出
