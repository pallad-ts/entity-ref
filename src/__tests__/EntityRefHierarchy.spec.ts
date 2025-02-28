import {createFactory} from "../createFactory";
import {EntityRefHierarchy} from "../EntityRefHierarchy";

import {assert, IsExact} from "conditional-type-checks";

describe('EntityRefHierarchy', () => {

	const factoryWorkspace = createFactory('WORKSPACE', (id: number) => id);
	const factoryProject = createFactory('PROJECT', (id: number) => id);
	const factoryCollection = createFactory('COLLECTION', (id: number) => id);

	const REF_WORKSPACE = factoryWorkspace(1);
	const REF_PROJECT = factoryProject(2);
	const REF_COLLECTION = factoryCollection(3);


	it('fails to create hierarchy without refs', () => {
		expect(() => new EntityRefHierarchy([] as never))
			.toThrowError('EntityRefHierarchy must contain at least one node');

		expect(() => new EntityRefHierarchy([undefined, undefined] as never))
			.toThrowError('EntityRefHierarchy must contain at least one node');
	});


	describe('simple hierarchy', () => {
		const hierarchy = new EntityRefHierarchy([REF_WORKSPACE, REF_PROJECT, REF_COLLECTION] as const);

		it('getting root and leaf refs', () => {
			expect(hierarchy.root)
				.toEqual(REF_WORKSPACE);
			expect(hierarchy.leaf)
				.toEqual(REF_COLLECTION);
		});

		it('getting refs', () => {
			expect(hierarchy.getRef('WORKSPACE'))
				.toEqual(REF_WORKSPACE);
			expect(hierarchy.getRef('PROJECT'))
				.toEqual(REF_PROJECT);
			expect(hierarchy.getRef('COLLECTION'))
				.toEqual(REF_COLLECTION);
		});


		describe('types test', () => {
			it('basic', () => {
				const workspaceRef = hierarchy.getRef('WORKSPACE');
				const projectRef = hierarchy.getRef('PROJECT');
				const collectionRef = hierarchy.getRef('COLLECTION');

				assert<IsExact<typeof workspaceRef, ReturnType<typeof factoryWorkspace>>>(true);
				assert<IsExact<typeof projectRef, ReturnType<typeof factoryProject>>>(true);
				assert<IsExact<typeof collectionRef, ReturnType<typeof factoryCollection>>>(true);
			});

			it('root', () => {
				const root = hierarchy.root;
				assert<IsExact<typeof root, ReturnType<typeof factoryWorkspace>>>(true);
			});

			it('leaf', () => {
				const leaf = hierarchy.leaf;
				assert<IsExact<typeof leaf, ReturnType<typeof factoryCollection>>>(true);
			});
		});

		it('iterating', () => {
			expect([...hierarchy])
				.toEqual([REF_WORKSPACE, REF_PROJECT, REF_COLLECTION]);
		});
	});

	describe('optional ref hierarchy at root', () => {
		const hierarchy = new EntityRefHierarchy([
			undefined as ReturnType<typeof factoryWorkspace> | undefined,
			REF_PROJECT,
			REF_COLLECTION
		] as const);

		it('getting root and leaf refs', () => {
			expect(hierarchy.root)
				.toEqual(REF_PROJECT);
			expect(hierarchy.leaf)
				.toEqual(REF_COLLECTION);
		});

		it('getting refs', () => {
			expect(hierarchy.getRef('WORKSPACE'))
				.toBeUndefined();
			expect(hierarchy.getRef('PROJECT'))
				.toEqual(REF_PROJECT);
			expect(hierarchy.getRef('COLLECTION'))
				.toEqual(REF_COLLECTION);
		});

		describe('types test', () => {
			it('basic', () => {
				const workspaceRef = hierarchy.getRef('WORKSPACE');
				const projectRef = hierarchy.getRef('PROJECT');
				const collectionRef = hierarchy.getRef('COLLECTION');

				assert<IsExact<typeof workspaceRef, ReturnType<typeof factoryWorkspace> | undefined>>(true);
				assert<IsExact<typeof projectRef, ReturnType<typeof factoryProject>>>(true);
				assert<IsExact<typeof collectionRef, ReturnType<typeof factoryCollection>>>(true);
			});

			it('root', () => {
				const root = hierarchy.root;
				assert<IsExact<typeof root, ReturnType<typeof factoryWorkspace> | ReturnType<typeof factoryProject>>>(true);
			});

			it('leaf', () => {
				const leaf = hierarchy.leaf;
				assert<IsExact<typeof leaf, ReturnType<typeof factoryCollection>>>(true);
			});
		});

		it('iterating', () => {
			expect([...hierarchy])
				.toEqual([REF_PROJECT, REF_COLLECTION]);
		});
	});

	describe('optional ref hierarchy at leaf', () => {
		const hierarchy = new EntityRefHierarchy([
			REF_WORKSPACE,
			REF_PROJECT,
			undefined as ReturnType<typeof factoryCollection> | undefined
		] as const);

		it('getting root and leaf refs', () => {
			expect(hierarchy.root)
				.toEqual(REF_WORKSPACE);
			expect(hierarchy.leaf)
				.toEqual(REF_PROJECT);
		});

		it('getting refs', () => {
			expect(hierarchy.getRef('WORKSPACE'))
				.toEqual(REF_WORKSPACE);
			expect(hierarchy.getRef('PROJECT'))
				.toEqual(REF_PROJECT);
			expect(hierarchy.getRef('COLLECTION'))
				.toEqual(undefined);
		});

		describe('types test', () => {
			it('basic', () => {
				const workspaceRef = hierarchy.getRef('WORKSPACE');
				const projectRef = hierarchy.getRef('PROJECT');
				const collectionRef = hierarchy.getRef('COLLECTION');

				assert<IsExact<typeof workspaceRef, ReturnType<typeof factoryWorkspace>>>(true);
				assert<IsExact<typeof projectRef, ReturnType<typeof factoryProject>>>(true);
				assert<IsExact<typeof collectionRef, ReturnType<typeof factoryCollection> | undefined>>(true);
			});

			it('root', () => {
				const root = hierarchy.root;
				assert<IsExact<typeof root, ReturnType<typeof factoryWorkspace>>>(true);
			});

			it('leaf', () => {
				const leaf = hierarchy.leaf;
				assert<IsExact<typeof leaf, ReturnType<typeof factoryCollection> | ReturnType<typeof factoryProject>>>(true);
			});
		});

		it('iterating', () => {
			expect([...hierarchy])
				.toEqual([REF_WORKSPACE, REF_PROJECT]);
		});
	});

	describe('all refs optional', () => {

	});
})
