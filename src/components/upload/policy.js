import http from '@/utils/httpRequest.js'
export function policy (dirName, fileName) {
  return new Promise((resolve, reject) => {
    http({
      url: http.adornUrl('/thirdparty/oss/getPolicy'),
      method: 'get',
      params: http.adornParams({
        'fileName': fileName,
        'dirName': dirName
      })
    }).then(({ data }) => {
      resolve(data)
    })
  })
}
