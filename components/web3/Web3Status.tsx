import Button from '@/components/button';
import Popover from '@/components/popover';
import PosterButton from '@/components/poster/PosterButton';
import { Platform } from '@/constants';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useMutationLogin } from '@/hooks/user';
import { useSignInWithEthereum } from '@/hooks/useSignInWithEthereum';
import { posterCaptureAtom } from '@/store/poster/state';
import { accessTokenAtom } from '@/store/user/state';
import { isConnectPopoverOpen } from '@/store/web3/state';
import { getAccessToken } from '@/utils/authorization';
import { watchAccount } from '@wagmi/core';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { polygon } from 'wagmi/chains';
import WalletPopover from './WalletPopover';
import Web3StatusInner from './Web3StatusInner';

function Web3Status() {
  const router = useRouter();
  const { chain } = useNetwork();
  const isMounted = useIsMounted();
  const { mutate } = useMutationLogin();
  const { address } = useAccount();
  const setAccessToken = useSetRecoilState(accessTokenAtom);
  const unwatchAccount = useRef<() => void>();
  const { signInWithEthereum } = useSignInWithEthereum({
    onSuccess: (args) => mutate({ ...args, platform: Platform.USER }),
  });
  const { isConnected } = useAccount({
    onConnect({ address, isReconnected }) {
      unwatchAccount.current = watchAccount(({ isConnected, address }) => {
        const accessToken = getAccessToken({ address });
        if (address && isConnected && !accessToken) {
          signInWithEthereum(address).then();
        }
      });
      if (isReconnected || !address) return;
      signInWithEthereum(address).then();
    },
    onDisconnect() {
      unwatchAccount.current?.();
    },
  });
  const { switchNetwork } = useSwitchNetwork({ chainId: polygon.id });

  const [isOpen, setIsOpen] = useRecoilState(isConnectPopoverOpen);
  const posterCapture = useRecoilValue(posterCaptureAtom);

  useEffect(() => {
    const accessToken = getAccessToken({ address });
    setAccessToken(accessToken);
  }, [address, setAccessToken]);

  if (!isMounted) return null;

  if (router.pathname === '/gamer/[address]') {
    return posterCapture ? <PosterButton /> : null;
  }

  if (isConnected) {
    if (chain?.unsupported) {
      return (
        <Button size="small" type="error" className="h-10" onClick={() => switchNetwork?.()}>
          Wrong Network{chain?.id}
        </Button>
      );
    }
    return (
      <div className="flex items-center">
        {router.pathname === '/gamer' && posterCapture && <PosterButton />}
        <div className="flex rounded-full bg-[#44465F]/60 text-sm">
          <Web3StatusInner />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Popover open={isOpen} onOpenChange={(op) => setIsOpen(op)} render={({ close }) => <WalletPopover close={close} />}>
          <Button size="small" type="gradient" className="h-10 w-[120px]">
            Connect
          </Button>
        </Popover>
      </div>
    );
  }
}

export default Web3Status;
