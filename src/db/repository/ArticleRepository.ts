import {Article} from "../models/Article";


export class ArticleNotFound extends Error {
}


export async function findArticle(id: string) {
    const article: Article = await Article.findOne({where: {id}});
    if (!article) {
        throw new ArticleNotFound('Article does not exist');
    }
    return article;
}