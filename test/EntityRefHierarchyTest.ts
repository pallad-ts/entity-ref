import {createFactory} from "@src/createFactory";
import {EntityRefHierarchy} from "@src/EntityRefHierarchy";

describe('EntityRefHierarchy', () => {

	const factoryWorkspace = createFactory('workspace', (id: number) => id);
	const factoryProject = createFactory('project', (id: number) => id);
	const factoryCollection = createFactory('collection', (id: number) => id);


	const REF_WORKSPACE = factoryWorkspace(1);
	const REF_PROJECT = factoryProject(2);
	const REF_COLLECTION = factoryCollection(3);

	it('fails to create hierarchy without refs', () => {
		expect(() => new EntityRefHierarchy([] as never))
			.toThrowError('EntityRefHierarchy must contain at least 1 element');
	});


	describe('simple hierarchy', () => {
		const hierarchy = new EntityRefHierarchy([REF_WORKSPACE, REF_PROJECT, REF_COLLECTION]);

		it('getting root and leaf refs', () => {
			expect(hierarchy.rootRef())
				.toEqual(REF_WORKSPACE);
			expect(hierarchy.leafRef())
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

		it('iterating', () => {
			expect([...hierarchy])
				.toEqual([REF_WORKSPACE, REF_PROJECT, REF_COLLECTION]);
		});
	});

	describe('optional ref hierarchy', () => {

		function* list(): Generator<ReturnType<typeof factoryWorkspace> | ReturnType<typeof factoryProject> | ReturnType<typeof factoryCollection> | undefined> {
			yield undefined;
			yield REF_PROJECT;
			yield REF_COLLECTION;
		}

		const hierarchy = EntityRefHierarchy.fromOptionalRefs(list())!;


		it('fails to return hierarchy without refs', () => {
			function* list(): Generator<ReturnType<typeof factoryWorkspace> | ReturnType<typeof factoryProject> | ReturnType<typeof factoryCollection> | undefined> {
				yield undefined;
			}

			const hierarchy = EntityRefHierarchy.fromOptionalRefs(list())
			expect(hierarchy).toBeUndefined();
		});

		it('getting root and leaf refs', () => {
			expect(hierarchy.rootRef())
				.toEqual(REF_PROJECT);
			expect(hierarchy.leafRef())
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

		it('iterating', () => {
			expect([...hierarchy])
				.toEqual([REF_PROJECT, REF_COLLECTION]);
		});
	})
})
