import {CommentActionsType} from "../../../types/comment-actions.type";
import {AppliedCommentActionType} from "../../../types/applied-comment-action.type";
import {CommentType} from "../../../types/comment.type";

export class AppliedActionsUtil {
  static setMyReactions(appliedCommentActions: AppliedCommentActionType[], resultComments: CommentType[]) {
    appliedCommentActions.forEach(action => {
      const foundComment = resultComments.find(comment => action.comment === comment.id);
      if (foundComment) {
        if (action.action === CommentActionsType.like) {
          foundComment.likedFromMe = true;
        }
        if (action.action === CommentActionsType.dislike) {
          foundComment.dislikedFromMe = true;
        }
      }
    });
  }
}
