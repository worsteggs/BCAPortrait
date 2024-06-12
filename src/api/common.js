import request from '@/utils/request'
import axios from 'axios'

export function filterSelect(params) {
  return request({
    url: '/system/common/filterSelect',
    method: 'get',
    params
  })
}

export function getMetadataDict(params) {
  return request({
    url: '/system/metadataDict/getMetadataDict',
    method: 'get',
    params
  })
}

export function getCellComposition(params) {
  return request({
    url: '/system/common/getCellComposition',
    method: 'get',
    params,
  })
}

export function getCellCompositionForDownload(params) {
  return request({
    url: '/system/common/getCellComposition',
    method: 'get',
    params,
    responseType:'arraybuffer'
  })
}


export function getCellTypeNodeData(params) {
  return request({
    url: '/system/cellType/getNodeData',
    method: 'get',
    params
  })
}

export function getCellTypeList(params) {
  return request({
    url: '/system/cellType/getList',
    method: 'get',
    params
  })
}

export function getOrganNodeData(params) {
  return request({
    url: '/system/organ/getNodeData',
    method: 'get',
    params
  })
}

export function getAllOrganNodeData() {
  return request({
    url: '/system/organ/getAllNodeData',
    method: 'get',
  })
}

export function getOrganList(params) {
  return request({
    url: '/system/organ/getList',
    method: 'get',
    params
  })
}

export function getCellTypeById(params) {
  return request({
    url: '/system/cellType/getCellTypeById',
    method: 'get',
    params
  })
}

export function getOrganById(params) {
  return request({
    url: '/system/organ/getOrganById',
    method: 'get',
    params
  })
}

export function getCellDistribution(params) {
  return request({
    url: '/system/cellType/getCellDistribution',
    method: 'get',
    params
  })
}
export function getCellDistributionForDownload(params) {
  return request({
    url: '/system/cellType/getCellDistribution',
    method: 'get',
    params,
    responseType:'arraybuffer'
  })
}
export function getGeneById(params) {
  return request({
    url: '/system/gene/getGeneById',
    method: 'get',
    params
  })
}
export function getMarkersByGene(params) {
  return request({
    url: '/system/gene/getMarkersByGene',
    method: 'get',
    params
  })
}

export function getGeneProfiling(params) {
  return request({
    url: '/system/gene/getGeneProfiling',
    method: 'get',
    params,
    timeout: 1000 * 60*20
  })
}

export function search(params) {
  return request({
    url: '/system/organ/search',
    method: 'get',
    params
  })
}

export function getSysConfigByName(params) {
  return request({
    url: '/system/sysConfig/getSysConfigByName',
    method: 'get',
    params
  })
}


export const getJson = function (url) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      dataType: "json",
      crossDomain: true,
      cache: false
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}
export function get2DVisualization(params) {
  return request({
    url: '/system/organ/get2DVisualization',
    method: 'get',
    params
  })
}

export function taskProcess(params) {
  return request({
    url: '/system/common/taskProcess',
    method: 'get',
    params
  })
}

export function getGeneBoxplot(params) {
  return request({
    url: '/system/gene/getGeneBoxplot',
    method: 'get',
    params
  })
}
export function getGeneRidgeplot(params) {
  return request({
    url: '/system/gene/getGeneRidgeplot',
    method: 'get',
    params
  })
}
/* /system/cellSelection/getIndexCollections 首页静态链接*/
export function getIndexCollections(params) {
  return request({
    url: '/system/cellSelection/getIndexCollections',
    method: 'get',
    params
  })
}
