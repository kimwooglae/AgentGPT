import React, { useEffect } from "react";
import Button from "./Button";
import {
  FaKey,
  FaMicrochip,
  FaThermometerFull,
  FaExclamationCircle,
  FaSyncAlt,
  FaCoins,
} from "react-icons/fa";
import Dialog from "./Dialog";
import Input from "./Input";
import { GPT_MODEL_NAMES, GPT_4 } from "../utils/constants";
import Accordion from "./Accordion";
import type { ModelSettings } from "../utils/types";

export const SettingsDialog: React.FC<{
  show: boolean;
  close: () => void;
  customSettings: [ModelSettings, (settings: ModelSettings) => void];
}> = ({ show, close, customSettings: [customSettings, setCustomSettings] }) => {
  const [settings, setSettings] = React.useState<ModelSettings>({
    ...customSettings,
  });

  useEffect(() => {
    setSettings(customSettings);
  }, [customSettings, close]);

  const updateSettings = <Key extends keyof ModelSettings>(
    key: Key,
    value: ModelSettings[Key]
  ) => {
    setSettings((prev) => {
      return { ...prev, [key]: value };
    });
  };

  function keyIsValid(key: string | undefined) {
    const pattern = /^sk-[a-zA-Z0-9]{48}$/;
    return key && pattern.test(key);
  }

  const handleSave = () => {
    if (!keyIsValid(settings.customApiKey)) {
      alert(
        "key is invalid, please ensure that you have set up billing in your OpenAI account"
      );
      return;
    }

    setCustomSettings(settings);
    close();
    return;
  };

  const disabled = !settings.customApiKey;
  const advancedSettings = (
    <>
      <Input
        left={
          <>
            <FaThermometerFull />
            <span className="ml-2">Temp: </span>
          </>
        }
        value={settings.customTemperature}
        onChange={(e) =>
          updateSettings("customTemperature", parseFloat(e.target.value))
        }
        type="range"
        toolTipProperties={{
          message:
            "Higher values will make the output more random, while lower values make the output more focused and deterministic.",
          disabled: false,
        }}
        attributes={{
          min: 0,
          max: 1,
          step: 0.01,
        }}
      />
      <br />
      <Input
        left={
          <>
            <FaSyncAlt />
            <span className="ml-2">Loop #: </span>
          </>
        }
        value={settings.customMaxLoops}
        disabled={disabled}
        onChange={(e) =>
          updateSettings("customMaxLoops", parseFloat(e.target.value))
        }
        type="range"
        toolTipProperties={{
          message:
            "Controls the maximum number of loops that the agent will run (higher value will make more API calls).",
          disabled: false,
        }}
        attributes={{
          min: 1,
          max: 100,
          step: 1,
        }}
      />
      <br />
      <Input
        left={
          <>
            <FaCoins />
            <span className="ml-2">Tokens: </span>
          </>
        }
        value={settings.maxTokens ?? 400}
        disabled={disabled}
        onChange={(e) =>
          updateSettings("maxTokens", parseFloat(e.target.value))
        }
        type="range"
        toolTipProperties={{
          message:
            "Controls the maximum number of tokens used in each API call (higher value will make responses more detailed but cost more).",
          disabled: false,
        }}
        attributes={{
          min: 200,
          max: 2000,
          step: 100,
        }}
      />
    </>
  );

  return (
    <Dialog
      header="Settings ⚙"
      isShown={show}
      close={close}
      footerButton={<Button onClick={handleSave}>Save</Button>}
    >
      <p>
        여기에서 OpenAI API 키를 추가할 수 있습니다. 이렇게 하려면 비용을 지불해야 합니다.
        비용을 지불해야 하지만, AgentGPT에 더 많이 액세스할 수 있습니다! 다음을 수행할 수 있습니다.
        OpenAI가 제공하는 모든 모델을 추가로 선택할 수 있습니다.
      </p>
      <br />
      <p
        className={
          settings.customModelName === GPT_4
            ? "rounded-md border-[2px] border-white/10 bg-yellow-300 text-black"
            : ""
        }
      >
        <FaExclamationCircle className="inline-block" />
        &nbsp;
        <b>
        GPT-4 모델을 사용하려면 GPT-4용 API 키도 제공해야 합니다.&nbsp;
          <a
            href="https://openai.com/waitlist/gpt-4-api"
            className="text-blue-500"
          >
            링크
          </a>에서 요청할 수 있습니다.(ChatGPT Plus 구독이 작동하지 않습니다.)
        </b>
      </p>
      <br />
      <div className="text-md relative flex-auto p-2 leading-relaxed">
        <Input
          left={
            <>
              <FaKey />
              <span className="ml-2">Key: </span>
            </>
          }
          placeholder={"sk-..."}
          value={settings.customApiKey}
          onChange={(e) => updateSettings("customApiKey", e.target.value)}
        />
        <br className="md:inline" />
        <Input
          left={
            <>
              <FaMicrochip />
              <span className="ml-2">Model:</span>
            </>
          }
          type="combobox"
          value={settings.customModelName}
          onChange={() => null}
          setValue={(e) => updateSettings("customModelName", e)}
          attributes={{ options: GPT_MODEL_NAMES }}
          disabled={disabled}
        />
        <br className="hidden md:inline" />
        <Accordion
          child={advancedSettings}
          name="고급 설정"
        ></Accordion>
        <br />
        <strong className="mt-10">
          NOTE: 키를 받으려면 OpenAI 계정에 가입하고 다음 {" "}
          <a
            href="https://platform.openai.com/account/api-keys"
            className="text-blue-500"
          >
            링크
          </a>를 방문하세요.{" "}
          이 키는 현재 브라우저 세션에서만 사용됩니다.
        </strong>
      </div>
    </Dialog>
  );
};
