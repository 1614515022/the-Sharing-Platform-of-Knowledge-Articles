export default{
    getColumnList(state,columnList){
        state.columnList = columnList;
    },
    getoColumn(state,oColumn){
        state.oColumn = oColumn;
    },
    getArticle(state,articleList){
        state.articleList = articleList;
    },
    getoArticle(state,oArticle){
        state.oArticle = oArticle;
    },
    getMyColumn(state,myColumn){
        state.myColumn = myColumn;
    },
    getMyMsg(state,myMsg){
        state.myMsg = myMsg;
    },
    pushColumnList(state,columnList){
        state.columnList.push(columnList);
    },
    pushArticleList(state,articleList){
        state.articleList.push(articleList);
    },
    pushMyCollectList(state,myCollectList){
        state.myCollectList.push(myCollectList);
    },
    getCommentList(state,commentList){
        state.commentList = commentList;
    },
    getCommentIpt(state,commentIpt){
        state.commentIpt = commentIpt;
    },
    getDeleteList(state,deleteList){
        state.deleteList = deleteList
    },
    getResponseIpt(state,responseIpt){
        state.responseIpt = responseIpt;
    },
}