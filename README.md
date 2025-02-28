<div align="center">
<h1>Entity-ref 📍</h1>

<p>Create small references to entities</p>
</div>

---
[![CircleCI](https://circleci.com/gh/pallad-ts/entity-ref/tree/master.svg?style=svg)](https://circleci.com/gh/pallad-ts/entity-ref/tree/master)
[![npm version](https://badge.fury.io/js/@pallad%2Fentity-ref.svg)](https://badge.fury.io/js/@pallad%2Fentity-ref)
[![Coverage Status](https://coveralls.io/repos/github/pallad-ts/entity-ref/badge.svg?branch=master)](https://coveralls.io/github/pallad-ts/entity-ref?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
---

![Example code](./assets/intro-code.png)

Helper to create consistent entity references used for uniquely identify entity without all its data.

Especially useful if you need to create an address/reference of any kind of entity in places like:

# Use cases

* audit logs
* targeting entities in cascade actions for [`@pallad/cascade`](https://www.npmjs.com/package/@pallad/cascade)
* targeting in ACL
* passing entity reference through messaging channels without sending entire entity
* base for enigmatic IDs

# Installation

```shell
npm install @pallad/entity-ref
```

# Usage

The most useful part of this lib is `createFactory` responsible for creating entity ref, adding extra factories and
testing the type.

```typescript
const userRefFactory = createFactory(
	'user', // indicate type name
	(id: string) => ({id}), // main factory that also describes the shape of entity ref data
);

// create ref for given ID
const ref = userRefFactory('1'); // {type: 'user', data: {id: '1'}}
```

## Testing type

You can check if ref is actually a ref for given type using `.is` method.

```typescript
const articleRefFactory = createFactory(
	'ARTICLE',
	(id: string) => ({id}),
);

const ref = articleRefFactory('1'); // {type: 'ARTICLE', data: {id: '1'}}

userRefFactory.is(ref) // false
articleRefFactory.is(ref) // true
```

`.is` plays a role of type guard as well.

```typescript
if (articleRefFactory.is(ref)) {
	ref.type // 'ARTICLE';
	ref.data.id // 👍 typescript knows shape of article refs so no error here
	ref.data.someOtherProperty // ⚠️ this fails
}
```

## Extra factories

Third argument of `createFactory` accepts an object with extra factories in final factory object.

```typescript
class Article {
	readonly id: string;
	readonly title: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly authorId: string;

	constructor(data: Article) {
		Object.assign(this, data);
	}
}

const articleRefFactory = createFactory(
	'ARTICLE',
	(id: string) => (id),
	{
		fromEntity({id}: Article) {
			return id; // note that it has to return the same data shape as above
		}
	}
);

articleRefFactory('10');
// {type: 'ARTICLE', data: '10'}

articleRefFactory.fromEntity(
	new Article({
		id: '10',
		title: 'Example title',
		createdAt: new Date(),
		updatedAt: new Date(),
		authorId: '20'
	})
);
// {type: 'ARTICLE', data: '10'}
```

# Hierarchical data

Various entities are often arranged in hierarchies. For example `ARTICLE` is always under certain `WORKSPACE`.

To represent that hierarchy we can use `EntityRefHierarchy` class.

```typescript
export class ArticleRefHierarchy extends EntityRefHierarchy<[WorkspaceRef, ArticleRef]> {
	constructor(workspaceRef: WorkspaceRef, articleRef: ArticleRef) {
		super([workspaceRef, articleRef]);
	}
}

const hierarchy = new ArticleRefHierarchy(workspaceRefFactory('1'), articleRefFactory('10'));
hierarchy.root // {type: 'WORKSPACE', data: '1'}
hierarchy.leaf // {type: 'ARTICLE', data: '1'}
```

## Optional hierarchy nodes

Certain nodes in hierarchy can be optional.

In that case `root` returns first defined node

```typescript

const hierarchy = new EntityRefHierarchy([undefined, articleRefFactory('10')]);
hierarchy.root // {type: 'ARTICLE', data: '10'}
```

And `leaf` returns last defined node

```typescript
const hierarchy = new EntityRefHierarchy([articleRefFactory('10'), undefined]);
hierarchy.root // {type: 'ARTICLE', data: '10'}
```

> [!NOTE]  
> `EntityRefHierarchy` requires at least one defined node in hierarchy therefore it is not possible for `root` and
`leaf` to return undefined

# List of refs

`EntityRefList` is a class that represents a list of entity refs of type same type.

```typescript
const list = new EntityRefList([articleRefFactory('1'), articleRefFactory('2')]);
Array.from(list); // [{type: 'ARTICLE', data: '1'}, {type: 'ARTICLE', data: '2'}]
```

`EntityRefList` requires at least one ref to be provided.

```typescript
import {EntityRefList} from "./EntityRefList";

new EntityRefList([undefined]) // throws error
```

## Creating list from array
For type safety you can use `EntityRef.fromArray` to safely ensure that at least one ref is provided.

```typescript

EntityRefList.fromArray([]) // undefined
EntityRefList.fromArray([undefined]) // undefined
EntityRefList.fromArray([articleRefFactory('1')]) // same as new EntityRefList([articleRefFactory('1')])
```

# Examples

## Targeting in ACL

```typescript
import {EntityRef} from "@pallad/entity-ref";

export function hasReadPermission(entityRef: EntityRef<any, any>) {
	if (entityRef.type === 'article') {
		// TODO perform extra checks
	} else if (entityRef.type === 'user') {
		// TODO perform extra checks
	}
	return false;
}

// controller.ts
export default {
	findArticle(id: string) {
		if (!hasReadPermission(articleRefFactory(id))) {
			throw new Error('Insufficient permissions');
		}
		// fetch and return article
	}
}
```

## Audit log

```typescript
import {AnyRef} from "@pallad/entity-ref";

export function articleCreated(article: Article) {
	return entityCreated(articleRefFactory.fromEntity(article));
}

export function entityCreated(ref: AnyRef) {
	return createAuditLog({
		name: 'entity.created',
		ref
	});
}
```

## Enigmatic IDs

```typescript
import {EntityRef} from "@pallad/entity-ref";

export function decodeId(id: string): EntityRef<string, { id: string }> {
	const [type, id] = Buffer.from(id, 'base64').toString('utf8').split('-');
	return EntityRef.create(type, {id});
}

export function encodeId(ref: EntityRef<string, { id: string }>) {
	return Buffer.from(`${ref.type}-${ref.data.id}`).toString('base64');
}

encodeId(articleRefFactory('1')) // 'YXJ0aWNsZS0x'
decodeId('YXJ0aWNsZS0x') // {type: 'article', data: {id: '1'}}
```
