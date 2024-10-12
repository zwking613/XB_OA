import { createRouter, createWebHashHistory } from 'vue-router'

export const routes = [
    {
        name: '费用统计',
        path: '/costStatistics',
        component: () => import('@/pages/costStatistics/index.vue'),
        meta: {
            icon: 'HomeFilled'
        }
    },
    {
        name: '文件管理',
        path: '/fileManagement/',
        component: () => import('@/pages/fileManagement/index.vue'),
        children: [
            {
                name: '文件管理',
                path: 'files',
                component: () => import('@/pages/fileManagement/files.vue'),
                meta: {
                    icon: 'Document'
                }
            },
            {
                name: '文件审核',
                path: 'filesAudit',
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
        path: '/userManagement/',
        component: () => import('@/pages/userManagement/index.vue'),    
        children: [
            {
                name: '用户管理',
                path: 'user',
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
        path: '/departmentManagement/',
        component: () => import('@/pages/departmentManagement/index.vue'),
        children: [
            {
                name: '部门管理',
                path: 'department',
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
        name: '流程配置',
        path: '/sysConfig/',
        component: () => import('@/pages/sysConfig/index.vue'),
        children: [
            {
                name: '流程配置',
                path: 'sys',
                component: () => import('@/pages/sysConfig/sys.vue'),
                meta: {
                    icon: 'Setting'
                }
            },
            {
                name: '流程模型',
                path: 'model',
                component: () => import('@/pages/sysConfig/model.vue'),
                meta: {
                    icon: 'Setting'
                }
            },
            {
                name: '配置',
                path: 'config',
                component: () => import('@/pages/sysConfig/config.vue'),
                meta: {
                    icon: 'Setting'
                }
            }
            // {
            //     name: '审核配置',
            //     path: 'approvalConfig',
            //     component: () => import('@/pages/sysConfig/approvalConfig.vue'),
            //     meta: {
            //         icon: 'Setting'
            //     }
            // },
            // {
            //     name: '项目配置',
            //     path: 'projectConfig',
            //     component: () => import('@/pages/sysConfig/projectConfig.vue'),
            //     meta: {
            //         icon: 'Setting'
            //     }
            // }
        ],
        meta: {
            icon: 'Setting'
        }
    },
    {
        name: '项目推进',
        path: '/pps/',
        component: () => import('@/pages/pps/index.vue'),
        meta: {
            icon: 'Setting'
        }
    }
]
const router = createRouter({
    // history: createWebHistory(),//工作模式 ，还有一种是hash
    history: createWebHashHistory(),//工作模式 
    routes: [{
        path: '/',
        redirect: '/costStatistics',
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
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }

        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
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
