import AssetType from "./asset-type";

interface Metadata {
	readonly url: string;
}

const LIMIT: 10 | 25 | 50 | 100 = 100;

export const AssetTypeMeta: { [assetType in AssetType]: Metadata } = {
	[AssetType.Pants]: {
		url: `https://itemconfiguration.roblox.com/v1/creations/get-assets?assetType=Pants&limit=${LIMIT}&groupId=1114545&cursor=`,
	},
	[AssetType.Shirt]: {
		url: `https://itemconfiguration.roblox.com/v1/creations/get-assets?assetType=Shirt&limit=${LIMIT}&groupId=1114545&cursor=`,
	},
};

export default AssetTypeMeta;
