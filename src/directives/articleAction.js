import { agreeListIpt, getAgreeList, getCollectList, collectListIpt } from '@/services/articleRequest';

export default {
    async mounted(el, binding) {
        const { articleId, isLogin } = binding.value;
        let userId = localStorage.getItem('userId')
        let token = localStorage.getItem('token');
        let res = await getAgreeList({
            data: {
                articleId: articleId
            }
        })
        let agreeList = res.data.data.agreeList

        if (agreeList != null) {
            let comma = parseInt(agreeList.length / 2)
            let index = ''
            if (agreeList.indexOf(userId) != 0) {
                index = agreeList.indexOf(userId) - comma
            } else {
                index = agreeList.indexOf(userId)
            }
            if (index != -1 - comma) {
                $(el).children('li:eq(0)').css({
                    backgroundColor: '#0d6efd',
                    color: 'white'
                })
            }
        }

        let result = await getCollectList({
            data: {
                articleId: articleId
            }
        })
        let collectList = result.data.data.collectList

        if (collectList != null) {
            let comma = parseInt(collectList.length / 2)
            let index = ''
            if (collectList.indexOf(userId) != 0) {
                index = collectList.indexOf(userId) - comma
            } else {
                index = collectList.indexOf(userId)
            }
            if (index != -1 - comma) {
                $(el).children('li:eq(2)').css({
                    backgroundColor: '#0d6efd',
                    color: 'white'
                })
            }
        }

        $(el).children('li:eq(0)').on('click', async () => {
            if (token == '') {
                console.log(1)
                isLogin = true;
            }
            let res = await getAgreeList({
                data: {
                    articleId: articleId
                }
            })
            let agreeList = res.data.data.agreeList
            if (agreeList != '' && agreeList != null) {
                let comma = parseInt(agreeList.length / 2)
                let index = ''

                if (agreeList.indexOf(userId) != 0) {
                    index = agreeList.indexOf(userId) - comma
                } else {
                    index = agreeList.indexOf(userId)
                }

                if (index != -1 - comma) {
                    $(el).children('li:eq(0)').css({
                        backgroundColor: 'rgba(0,102,255,.1)',
                        color: '#0d6efd'
                    })

                    let agreeArr = agreeList.split(',')
                    //console.log(index)
                    agreeArr.splice(index, 1)
                    let agreeStr = agreeArr.join(',')
                    //console.log(agreeStr)
                    await agreeListIpt({
                        data: {
                            newAgreeList: agreeStr,
                            articleId: articleId,
                        }
                    })
                } else {
                    $(el).children('li:eq(0)').css({
                        backgroundColor: '#0d6efd',
                        color: 'white'
                    })
                    let agreeArr = agreeList.split(',')
                    agreeArr.push(userId)
                    let agreeStr = agreeArr.join(',')

                    await agreeListIpt({
                        data: {
                            newAgreeList: agreeStr,
                            articleId: articleId,
                        }
                    })
                }

            } else {
                $(el).children('li:eq(0)').css({
                    backgroundColor: '#0d6efd',
                    color: 'white'
                })
                await agreeListIpt({
                    data: {
                        newAgreeList: userId,
                        articleId: articleId,
                    }
                })
            }
        })
        $(el).children('li:eq(2)').on('click', async () => {
            let res = await getCollectList({
                data: {
                    articleId: articleId
                }
            })
            let collectList = res.data.data.collectList
            if (collectList != '' && collectList != null) {
                let comma = parseInt(collectList.length / 2)
                let index = ''

                if (collectList.indexOf(userId) != 0) {
                    index = collectList.indexOf(userId) - comma
                } else {
                    index = collectList.indexOf(userId)
                }

                if (index != -1 - comma) {
                    $(el).children('li:eq(2)').css({
                        backgroundColor: 'rgba(0,102,255,.1)',
                        color: '#0d6efd'
                    })

                    let collectArr = collectList.split(',')
                    //console.log(index)
                    collectArr.splice(index, 1)
                    let collectStr = collectArr.join(',')
                    //console.log(agreeStr)
                    await collectListIpt({
                        data: {
                            newAgreeList: collectStr,
                            articleId: articleId,
                        }
                    })
                } else {
                    $(el).children('li:eq(0)').css({
                        backgroundColor: '#0d6efd',
                        color: 'white'
                    })
                    let collectArr = collectList.split(',')
                    collectArr.push(userId)
                    let collectStr = collectArr.join(',')

                    await collectListIpt({
                        data: {
                            newCollectList: collectStr,
                            articleId: articleId,
                        }
                    })
                }

            } else {
                $(el).children('li:eq(2)').css({
                    backgroundColor: '#0d6efd',
                    color: 'white'
                })
                await collectListIpt({
                    data: {
                        newCollectList: userId,
                        articleId: articleId,
                    }
                })
            }
        })
    }
}