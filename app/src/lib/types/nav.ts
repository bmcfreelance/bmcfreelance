import type { Component } from 'svelte';

export type NavItem = {
	title: string;
	url: string;
	icon: Component<any>;
};
