/**
 * Created by haozi on 11/5/2017.
 */

const axios = require('axios')

module.exports = class doufu {
  constructor() {

  }

  static async getWhiteList() {
    const { data, status } = await axios.get('http://127.0.0.1:8099/whitelist')
    if( status !== 200) {
      throw Error("服务器无法连接~")
    }
    return data
  }

  static async addWhiteName(name) {
    const { data, status } = await axios.put('http://127.0.0.1:8099/whitelist', { name })
    console.log(status)
    if( status !== 200) {
      throw Error("服务器无法连接~")
    }
    return data
  }
  static async deleteWhiteName(name) {
    const { data, status } = await axios.delete(`http://127.0.0.1:8099/whitelist/${name}`)
    if( status !== 200) {
      throw Error("服务器无法连接~")
    }
    return data
  }
}