import $ from 'jquery';
import { delay,createNode } from '@/libs/utils'
import { searchAll } from '@/services/columnRequest'

export default{
    mounted (el, binding) {
        const { searchIpt } = binding.value;
        $(el).on('focus',()=>{
            $(el).siblings('.searchText')[0].style.display = 'block';
        })
        $(el).on('blur',(e)=>{
            setTimeout(()=>{
                $(el).siblings('.searchText')[0].style.display = 'none';
            },200)
            
        })
        $(el).siblings('.searchText').on('mouseover',(e)=>{
            if(e.target.tagName == 'LI'){
                e.target.style.backgroundColor = '#ccc'
                if($(el).siblings('.searchText').children().length > 1){
                    $(e.target).siblings('li')[0].style.backgroundColor = "white"
                }
            }
        })
    },
    async updated(el,binding){
        const { searchIpt } = binding.value;
        if($(el).siblings('.searchText').find('.hotSearch')[0]){
            $(el).siblings('.searchText').find('.hotSearch')[0].style.display = 'none'
        }
        delay(async()=>{
            $(el).siblings('.searchText').empty()
            let res = await searchAll({
                data:{
                    searchIpt : searchIpt,
                }
            })
            if(res.data.code == 200){
                let article = res.data.article;
                let column = res.data.column;
                if(article.length > 0){
                    let articleStr = article.map((item)=>{
                        return createNode(item.title)
                    })
                    $(el).siblings('.searchText').append(articleStr)
                    $(el).siblings('.searchText').find('li').on('click',(e)=>{
                        //console.log(e.target)
                        let selectTitle = e.target.innerHTML
                        let articleId = ''
                        for(let i=0;i<article.length;i++){
                            if(selectTitle == article[i].title){
                                articleId = article[i].id
                            }
                        }
                        window.location.replace(`http://localhost:8080/#/article/${articleId}`)
                    })
                }
                if(column.length > 0){
                    let columnStr = column.map((item)=>{
                        return createNode(item.title)
                    })
                    $(el).siblings('.searchText').append(columnStr)
                    $(el).siblings('.searchText').find('li').on('click',(e)=>{
                        console.log(e.target)
                        let selectTitle = e.target.innerHTML
                        let columnId = ''
                        for(let i=0;i<column.length;i++){
                            if(selectTitle == column[i].title){
                                columnId = column[i].id
                            }
                        }
                        setTimeout(()=>{
                            window.location.replace(`http://localhost:8080/#/oColumn/${columnId}`)
                        },200)
                    })
                }
            }else{
                let tipText = createNode('没有搜素结果')
                $(el).siblings('.searchText').append(tipText)
            }
        },500)
        
    }
}