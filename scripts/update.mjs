import fetch from 'node-fetch';
import { getOctokit, context } from '@actions/github';
 
const UPDATE_TAG_NAME = 'updater';
const UPDATE_FILE_NAME = 'update.json';
 
// 获取签名内容
const getSignature = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/octet-stream' }
  });
  return response.text();
};
 
// 需要生成的静态 json 文件数据，根据自己的需要进行调整
const updateData = {
  version: '',
  pub_date: new Date().toISOString(),
  platforms: {
    win64: { signature: '', url: '' },
    linux: { signature: '', url: '' },
    darwin: { signature: '', url: '' },
    'linux-x86_64': { signature: '', url: '' },
    'windows-x86_64': { signature: '', url: '' }
  }
};
 
// 用户名，仓库名 
const options = { owner: context.repo.owner, repo: context.repo.repo };
const octokit = getOctokit(process.env.GITHUB_TOKEN);

// 获取此 tag 的详细信息
const { data: release } = await octokit.rest.repos.getLatestRelease(options);
updateData.version = release.tag_name;
// eslint-disable-next-line camelcase
for (const { name, browser_download_url } of release.assets) {
  if (name.endsWith('.msi.zip')) {
    // 设置下载链接
    updateData.platforms.win64.url = browser_download_url;
    // 设置下载链接
    updateData.platforms['windows-x86_64'].url = browser_download_url;
  } else if (name.endsWith('.msi.zip.sig')) {
    // 获取平台签名
    const signature = await getSignature(browser_download_url);
    // 设置平台签名，检测应用更新需要验证签名
    updateData.platforms.win64.signature = signature;
    // 设置平台签名，检测应用更新需要验证签名
    updateData.platforms['windows-x86_64'].signature = signature;
  } else if (name.endsWith('.app.tar.gz')) {
    updateData.platforms.darwin.url = browser_download_url;
  } else if (name.endsWith('.app.tar.gz.sig')) {
    const signature = await getSignature(browser_download_url);
    updateData.platforms.darwin.signature = signature;
  } else if (name.endsWith('.AppImage.tar.gz')) {
    updateData.platforms.linux.url = browser_download_url;
    updateData.platforms['linux-x86_64'].url = browser_download_url;
  } else if (name.endsWith('.AppImage.tae.gz.sig')) {
    const signature = await getSignature(browser_download_url);
    updateData.platforms.linux.signature = signature;
    updateData.platforms['linux-x86_64'].signature = signature;
  }
}
 
// 获取此 tag 的详细信息
const { data: updater } = await octokit.rest.repos.getReleaseByTag({
  ...options,
  tag: UPDATE_TAG_NAME
});
 
for (const { id, name } of updater.assets) {
  if (name === UPDATE_FILE_NAME) {
    // eslint-disable-next-line no-await-in-loop
    await octokit.rest.repos.deleteReleaseAsset({ ...options, asset_id: id });
    break;
  }
}
 
await octokit.rest.repos.uploadReleaseAsset({
  ...options,
  release_id: updater.id,
  name: UPDATE_FILE_NAME,
  data: JSON.stringify(updateData)
});