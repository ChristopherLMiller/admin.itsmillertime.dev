"use strict";

const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.gallery.search(ctx.query._q);
    } else {
      entities = await strapi.services.gallery.find(ctx.query);
    }

    let filteredEntities = [];

    // ok so now that we have all the entities we need to filter out results
    entities.forEach((entity) => {
      switch (entity.status) {
        // Public entities can be viewed by all
        case "PUBLIC": {
          filteredEntities.push(entity);
          break;
        }

        // Protected entities require user to be logged in to get their role to validate against
        case "PROTECTED": {
          if (ctx.state.user) {
            const filteredResults = entity.roles.filter(
              (entity) => entity.type === ctx.state.user.role.type
            );
            if (
              filteredResults.length > 0 ||
              ctx.state.user.role.type === "administrator"
            )
              filteredEntities.push(entity);
          }
          break;
        }

        // Draft, archived, and private can only be viewed by administrator at present
        case "DRAFT":
        case "ARCHIVED":
        case "PRIVATE": {
          if (ctx.state.user) {
            if (ctx.state.user.role.type === "administrator") {
              filteredEntities.push(entity);
            }
          }
          break;
        }
      }
    });

    return filteredEntities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.gallery })
    );
  },
};
