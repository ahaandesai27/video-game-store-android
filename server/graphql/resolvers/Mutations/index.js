import Games from './Games.js';
import Users from './Users.js';
import Categories from './Categories.js';
import Reviews from './Reviews.js';

export default {
    ...Games,
    ...Users,
    ...Categories,
    ...Reviews
}