/**
 * Created by haozi on 11/5/2017.
 */
const coolq = require('node-coolq')
const app = new coolq

const doufu = require('./Api/doufu')
const iconv = require('iconv-lite')

encode = (str) => (new Buffer(iconv.encode(str, 'gbk'))).toString('base64')

app.use(async (ctx, next) => {
  const { content } = ctx
  if (content[0] === 'GroupMessage' && content[2] === '379042204') {

    if(content[3] === '296409654' ||
    content[3] === '1142290163' ||
    content[3] === '1067770480'
    ) {
      try {
        const message = iconv.decode(new Buffer(content[5], 'base64'), 'gbk').split(" ")
        console.log(message)
        if(message[0][0] !== '#白名单' && message.length === 3) {
          if(message[1] === '添加') {
            if (/^[a-zA-Z][a-zA-Z0-9]{2,14}$/.test(message[2])) {
              await doufu.addWhiteName(message[2])
              console.log(`GroupMessage 379042204 ${encode(`玩家${message[2]} 添加成功`)}`)
              ctx.app.send(`GroupMessage 379042204 ${encode(`玩家${message[2]} 添加成功`)}`)
            } else {
              ctx.app.send(`GroupMessage 379042204 ${encode(`名称不和法`)}`)
            }
          } else if(message[1] === '删除') {
            await doufu.deleteWhiteName(message[2])
            ctx.app.send(`GroupMessage 379042204 ${encode(`玩家${message[2]} 删除成功`)}`)
          }
        }
      }catch (e) {
        await ctx.app.send(`PrivateMessage 296409654 ${encode(e.message)}`)
      }
    }
  }
  await next()
})
app.listen()