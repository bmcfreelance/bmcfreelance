<script>
	import { T, useTask } from '@threlte/core';
	import { untrack } from 'svelte';

	let meshRef = $state();

	useTask(() => {
		// untrack prevents Svelte from treating this as a reactive read
		const mesh = untrack(() => meshRef);
		if (mesh) mesh.rotation.y += 0.01;
	});
</script>

<T.Mesh bind:ref={meshRef}>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color="royalblue" />
</T.Mesh>
