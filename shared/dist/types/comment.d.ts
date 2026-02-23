import type { PublicUser } from '../dist/types/user.js';
/** Comment on a guide */
export interface Comment {
    id: string;
    guideId: string;
    authorId: string;
    author?: PublicUser;
    content: string;
    createdAt: string;
    updatedAt: string;
}
export interface CommentWithAuthor extends Comment {
    author: PublicUser;
}
//# sourceMappingURL=comment.d.ts.map