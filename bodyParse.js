/**
 * Created by haozi on 11/5/2017.
 */

// 事件名称  事件类型(subtype)  fromQQ toQQ message
module.exports = async (ctx, next) => {
  const {content} = ctx

  switch (content[0]) {
    case 'PrivateMessage':
      break
    case 'GroupMessage':
      break
    case 'DiscussMessage':
      break
  }

}