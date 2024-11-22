// 接口常量定义
// ==================== user.js ====================
// 用户登录
export const API_AUTH_LOGIN = '/api/v1/auth/authenticate'
// 用户注册
export const API_AUTH_REGISTER = '/api/v1/auth/register'
// 登录验证码
export const API_AUTH_CAPTCHA = '/api/v1/auth/captcha'
// 手机、邮箱验证码
export const API_AUTH_SMS = '/api/v1/auth/sms'

// 绑定手机号
export const API_USER_BIND_PHONE = '/api/v1/user/bindPhone'
// 核查手机号
export const API_USER_CHECK_PHONE = '/api/v1/user/checkPhone'
// 获取用户信息
export const API_USER_INFO = '/api/v1/user/info'
// 修改用户信息
export const API_USER_UPDATE = '/api/v1/user/update'
// 修改头像
export const API_USER_AVATAR = '/api/v1/user/avatar'
// 修改密码
export const API_USER_UPDATE_PASSWORD = '/api/v1/user/password'
// 获取用户列表
export const API_USER_LIST = '/api/v1/user/list'
// 修改用户状态
export const API_USER_UPDATE_STATUS = '/api/v1/user/status'
// 删除用户
export const API_USER_DELETE = '/api/v1/user/remove'
// 批量删除用户
export const API_USER_BATCH_DELETE = '/api/v1/user/batchRemove'
// 添加用户
export const API_USER_ADD = '/api/v1/user/add'
// 修改用户
export const API_USER_EDIT = '/api/v1/user/updates'
// 根据用户id获取用户已分配的角色
export const API_USER_ROLES = '/api/v1/user/toAssign'
// 给用户分配角色
export const API_USER_ASSIGN_ROLES = '/api/v1/user/doAssign'

// ==================== tag.js ====================
// 获取标签列表
export const API_TAG_LIST = '/api/v1/tag/list'
// 发布文章获取标签列表
export const API_ALL_TAG = '/api/v1/tag/allTag'
// 添加标签
export const API_TAG_ADD = '/api/v1/tag/add'
// 修改标签
export const API_TAG_UPDATE = '/api/v1/tag/update'
// 删除标签
export const API_TAG_DELETE = '/api/v1/tag/delete'
// 批量删除标签
export const API_TAG_BATCH_DELETE = '/api/v1/tag/deleteByIds'

// ==================== article.js ====================
// 获取文章列表
export const API_ARTICLE_CATEGORY_LIST = '/api/v1/category/list'
// 获取文章分类
export const API_ARTICLE_CATEGORY = '/api/v1/category/articleList'
// 添加文章分类
export const API_ARTICLE_CATEGORY_ADD = '/api/v1/category/add'
// 修改文章分类
export const API_ARTICLE_CATEGORY_UPDATE = '/api/v1/category/update'
// 删除文章分类
export const API_ARTICLE_CATEGORY_DELETE = '/api/v1/category/delete'
// 批量删除文章分类
export const API_ARTICLE_CATEGORY_BATCH_DELETE = '/api/v1/category/deleteByIds'
// 获取文章列表
export const API_ARTICLE_LIST = '/api/v1/article/list'
// 添加文章
export const API_ARTICLE_ADD = '/api/v1/article/add'
// 修改文章
export const API_ARTICLE_UPDATE = '/api/v1/article/update'
// 删除文章
export const API_ARTICLE_DELETE = '/api/v1/article/delete'

// ==================== role.js ====================
// 获取角色列表
export const API_ROLE_LIST = '/api/v1/role/list'
// 修改角色
export const API_ROLE_UPDATE = '/api/v1/role/update'
// 删除角色
export const API_ROLE_DELETE = '/api/v1/role/remove'
// 添加角色
export const API_ROLE_ADD = '/api/v1/role/save'
// 批量删除角色
export const API_ROLE_BATCH_DELETE = '/api/v1/role/batchRemove'

// ==================== menu.js ====================
// 获取菜单列表
export const API_MENU_LIST = '/api/v1/menu/findNodes'
// 添加菜单
export const API_MENU_ADD = '/api/v1/menu/save'
// 修改菜单
export const API_MENU_UPDATE = '/api/v1/menu/update'
// 删除菜单
export const API_MENU_DELETE = '/api/v1/menu/remove'
// 查看某个角色权限列表
export const API_MENU_ROLE_LIST = '/api/v1/menu/toAssign'
// 给某个角色授权
export const API_MENU_ROLE_ASSIGN = '/api/v1/menu/doAssign'
// 更新菜单状态
export const API_MENU_UPDATE_STATUS = '/api/v1/menu/updateStatus'

// ==================== carousel.js ====================
// 获取轮播图列表
export const API_CAROUSEL_LIST = '/api/v1/carousel/list'
// 添加轮播图
export const API_CAROUSEL_ADD = '/api/v1/carousel/add'
// 修改轮播图
export const API_CAROUSEL_UPDATE = '/api/v1/carousel/update'
// 删除轮播图
export const API_CAROUSEL_DELETE = '/api/v1/carousel/remove'
// 批量删除轮播图
export const API_CAROUSEL_BATCH_DELETE = '/api/v1/carousel/batchRemove'

// ==================== loginLog.js =====================
// 获取登录日志列表
export const API_LOGIN_LOG_LIST = '/api/v1/loginLog/list'
// 删除登录日志
export const API_LOGIN_LOG_DELETE = '/api/v1/loginLog/remove'
// 批量删除登录日志
export const API_LOGIN_LOG_BATCH_DELETE = '/api/v1/loginLog/batchRemove'
// 根据id获取登录日志
export const API_LOGIN_LOG_GET_BY_ID = '/api/v1/loginLog/get'

// ==================== operLog.js =====================
// 获取操作日志列表
export const API_OPER_LOG_LIST = '/api/v1/operLog/list'
// 删除操作日志
export const API_OPER_LOG_DELETE = '/api/v1/operLog/remove'
// 批量删除操作日志
export const API_OPER_LOG_BATCH_DELETE = '/api/v1/operLog/batchRemove'
// 根据id获取操作日志
export const API_OPER_LOG_GET_BY_ID = '/api/v1/operLog/get'