import type { PublicUser } from './user.js';
import type { MapMarker } from './marker.js';
/** Guide entity */
export interface Guide {
    id: string;
    title: string;
    slug: string;
    content: string;
    mapId: string;
    mapName: string;
    authorId: string;
    author?: PublicUser;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}
/** Guide with relations for list/detail views */
export interface GuideWithAuthor extends Guide {
    author: PublicUser;
}
/** Guide with markers for map view */
export interface GuideWithMarkers extends GuideWithAuthor {
    markers: MapMarker[];
}
//# sourceMappingURL=guide.d.ts.map