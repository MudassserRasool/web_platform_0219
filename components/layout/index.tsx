import {
  bitKeepConnector,
  chains,
  metaMaskConnector,
  particleAuthConnector,
  publicClient,
  tokenPocketConnector,
  walletConnectConnector,
  webSocketPublicClient,
} from '@/connectors';
import { fontVariants } from '@/constants/font';
import classNames from 'classnames';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';
import { createConfig, WagmiConfig } from 'wagmi';
import ButterflyGL from '../butterflyGL';
import GamerEmailDialog from '../dialog/GamerEmailDialog';
import InviteDialog from '../dialog/InviteDialog';
import RoadmapDialog from '../dialog/RoadmapDialog';
import ToastIcon from '../svg/ToastIcon';
import LayoutFooter from './LayoutFooter';
import LayoutHeader from './LayoutHeader';

const config = createConfig({
  autoConnect: true,
  connectors: [metaMaskConnector, tokenPocketConnector, bitKeepConnector, particleAuthConnector, walletConnectConnector],
  publicClient,
  webSocketPublicClient,
  chains,
});

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <WagmiConfig config={config}>
      <RecoilRoot>
        <div className={classNames('min-h-screen', ...fontVariants)}>
          <div className={classNames('mx-auto h-full 2xl:container', ...fontVariants)}>
            <LayoutHeader />
            <main>{children}</main>
            <LayoutFooter />
          </div>
          <InviteDialog />
          <RoadmapDialog />
          <GamerEmailDialog />
          <ToastContainer theme="dark" toastClassName="toast-container" icon={<ToastIcon />} autoClose={3000} hideProgressBar />
          {process.env.NODE_ENV === 'production' && <ButterflyGL />}
        </div>
      </RecoilRoot>
    </WagmiConfig>
  );
}
