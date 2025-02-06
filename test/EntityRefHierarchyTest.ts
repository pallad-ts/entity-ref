import {createFactory} from "@src/createFactory";
import {EntityRefHierarchy} from "@src/EntityRefHierarchy";

import {assert, IsExact} from "conditional-type-checks";

describe('EntityRefHierarchy', () => {

	const factoryWorkspace = createFactory('workspace', (id: number) => id);
	const factoryProject = createFactory('project', (id: number) => id);
	const factoryCollection = createFactory('collection', (id: number) => id);


	const REF_WORKSPACE = factoryWorkspace(1);
	const REF_PROJECT = factoryProject(2);
	const REF_COLLECTION = factoryCollection(3);

	it('fails to create hierarchy without refs', () => {
		expect(() => new EntityRefHierarchy([] as never))
			.toThrowError('EntityRefHierarchy must contain at least 1 ref');

		expect(() => new EntityRefHierarchy([undefined, undefined] as never))
			.toThrowError('EntityRefHierarchy must contain at least 1 ref');
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
			expect(hierarchy.getRef('workspace'))
				.toEqual(REF_WORKSPACE);
			expect(hierarchy.getRef('project'))
				.toEqual(REF_PROJECT);
			expect(hierarchy.getRef('collection'))
				.toEqual(REF_COLLECTION);
		});


		it('types test', () => {
			const workspaceRef = hierarchy.getRef('workspace');
			const projectRef = hierarchy.getRef('project');
			const collectionRef = hierarchy.getRef('collection');

			assert<IsExact<typeof workspaceRef, ReturnType<typeof factoryWorkspace>>>(true);
			assert<IsExact<typeof projectRef, ReturnType<typeof factoryProject>>>(true);
			assert<IsExact<typeof collectionRef, ReturnType<typeof factoryCollection>>>(true);
		});

		it('iterating', () => {
			expect([...hierarchy])
				.toEqual([REF_WORKSPACE, REF_PROJECT, REF_COLLECTION]);
		});
	});

	describe('optional ref hierarchy', () => {
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
			expect(hierarchy.getRef('workspace'))
				.toBeUndefined();
			expect(hierarchy.getRef('project'))
				.toEqual(REF_PROJECT);
			expect(hierarchy.getRef('collection'))
				.toEqual(REF_COLLECTION);
		});

		it('types test', () => {
			const workspaceRef = hierarchy.getRef('workspace');
			const projectRef = hierarchy.getRef('project');
			const collectionRef = hierarchy.getRef('collection');

			assert<IsExact<typeof workspaceRef, ReturnType<typeof factoryWorkspace> | undefined>>(true);
			assert<IsExact<typeof projectRef, ReturnType<typeof factoryProject>>>(true);
			assert<IsExact<typeof collectionRef, ReturnType<typeof factoryCollection>>>(true);
		});

		it('iterating', () => {
			expect([...hierarchy])
				.toEqual([REF_PROJECT, REF_COLLECTION]);
		});
	})
})
