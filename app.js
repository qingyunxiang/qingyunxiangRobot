/**
 * Created by haozi on 11/5/2017.
 */
const coolq = require('node-coolq')
const app = new coolq

const doufu = require('./Api/doufu')
const iconv = require('iconv-lite')

encode = (str) => (new Buffer(iconv.encode(str, 'gbk'))).toString('base64')

async function checkIsInWhitelist(uname) {
	var uList = await doufu.getWhiteList();
	var list = JSON.parse(uList["players"]);
	return list.indexOf(uname) > -1;
}

app.use(async (ctx, next) => {
    const { content } = ctx
    if (content[0] === 'GroupMessage' && (content[2] === '583037517' || content[2] === '730455691')) {

        if(content[3] === '296409654' ||
            content[3] === '1142290163' ||
            content[3] === '1042035699'
        ) {
            try {
                const message = iconv.decode(new Buffer(content[5], 'base64'), 'gbk').replace(/&#91;/g, '[').replace(/&#93;/g, ']').replace(/&amp;/g, '&').split(" ")
                console.log(message)
				if (message[0] === "#白名单" && message.length === 2) {
					console.log("whitelist handler");
					var user = message[1];
					if (/^[a-zA-Z_][a-zA-Z0-9_]{2,11}$/.test(user)) {
						checkIsInWhitelist(user).then(async function (bool){ 
							if (bool) {
								// Remove from whitelist
								await doufu.deleteWhiteName(user)
								ctx.app.send(`GroupMessage ${content[2]} ${encode(`玩家${user}在白名单中,并已成功删除.\n回滚操作请重复'${message.join(' ')}'`)}`)
							} else {
								// Add to whitelist
								await doufu.addWhiteName(user)
								ctx.app.send(`GroupMessage ${content[2]} ${encode(`玩家${user}不在白名单中,并已成功添加.\n回滚操作请重复'${message.join(' ')}'`)}`)
							}
						});
					} else {
                        ctx.app.send(`GroupMessage ${content[2]} ${encode(`${user}名称不合法, 只能由0-9,a-z以及下划线组成, 不能超过12字符`)}`)
                    }
				}
                /*if(message[0][0] !== '#白名单' && message.length === 3) {
                    if(message[1] === '添加') {
                        if (/^[a-zA-Z_][a-zA-Z0-9_]{2,11}$/.test(message[2])) {
                            await doufu.addWhiteName(message[2])
                            console.log(`GroupMessage ${content[2]} ${encode(`玩家${message[2]} 添加成功`)}`)
                            ctx.app.send(`GroupMessage ${content[2]} ${encode(`玩家${message[2]} 添加成功`)}`)
                        } else {
                            ctx.app.send(`GroupMessage ${content[2]} ${encode(`名称不合法, 只能由0-9,a-z以及下划线组成，不能超过12字符`)}`)
                        }
                    } else if(message[1] === '删除') {
                        await doufu.deleteWhiteName(message[2])
                        ctx.app.send(`GroupMessage ${content[2]} ${encode(`玩家${message[2]} 删除成功`)}`)
                    }
                }*/
				

                if(message[0] === '#exec') {
                  let cmd = message.concat()
                    cmd.shift()
                    console.log(cmd.join(" "))
                    await doufu.exec(cmd.join(" "))
					ctx.app.send(`GroupMessage ${content[2]} ${encode(`指令${cmd.join(" ")}执行成功`)}`)
                    
                }
                if(message[0] === '#send' || message[0] === '#tell' || message[0] === '#say') {
                    let cmd = message.concat()
                    cmd.shift()
                    console.log(cmd.join(" "))
                    await doufu.sendMessage(cmd.join(" "))
					ctx.app.send(`GroupMessage ${content[2]} ${encode(`消息${cmd.join(" ")} 发送成功`)}`)
                    
                }
            }catch (e) {
				console.error(e.message);
                await ctx.app.send(`PrivateMessage 296409654 ${encode(e.message)}`)
            }
        }
    }
    await next()
})
app.listen()
