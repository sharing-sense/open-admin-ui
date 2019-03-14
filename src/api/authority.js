/**
 * 权限管理
 */
import request from '@/libs/request'

/**
 * 获取用户已分配权限
 * @param roleId
 * @param grantMenus
 */
export const getUserGrantedAuthority = (userId) => {
  const data = {
    userId: userId
  }
  return request({
    url: 'base/authority/granted/user',
    data,
    method: 'post'
  })
}


/**
 * 获取菜单和操作权限列表
 * @param serviceId
 */
export const getAuthorityList = () => {
  return request({
    url: 'base/authority/list',
    method: 'get',
    params:{type:'1'}
  })
}

/**
 * 获取API权限列表
 * @param serviceId
 */
export const getApiAuthorityList = (serviceId) => {
  return request({
    url: 'base/authority/list',
    method: 'get',
    params:{type:'2',serviceId:serviceId}
  })
}
