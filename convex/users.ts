import {v} from 'convex/values'
import { mutation, query } from './_generated/server'

export const store = mutation({
    args: {},
    handler: async(ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity) {
            throw new Error('Unauthenticated')
        }

        console.log(identity);
        

        // check if we have a user with this identity
        const user = await ctx.db.query('users').withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier)).unique()

        if(user !== null) {
            if(user.username !== identity.nickname) {
                await ctx.db.patch(user._id, {username: identity.nickname})
            }
            return user._id
        }

        const userId = await ctx.db.insert('users', {
            fullName: identity.name!,
            username: identity.nickname!,
            tokenIdentifier: identity.tokenIdentifier,
            profileImageUrl: identity.profileUrl,
            title: '',
            about: '',
        })

        return userId;

    }
})


export const getCurrentUser = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null;
        }

        // throw new Error("Unauthenticated call to query");
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        return user;
    }
});

export const get = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id);
        return user;
    },
});

export const getUserByUsername = query({
    args: { username: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (args.username === undefined) return null;
        if (!args.username) return null;
        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username!))
            .unique();

        return user;
    },
});

export const getLanguagesByUsername = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        const languages = await ctx.db
            .query("languages")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .collect();

        return languages;
    },
});

export const getCountryByUsername = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        const country = await ctx.db.query("countries")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .unique();

        if (!country) {
            throw new Error("Country not found");
        }
        return country;
    },
});